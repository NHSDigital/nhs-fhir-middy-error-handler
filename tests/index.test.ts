import errorHandler from "../src"
import middy from "@middy/core"
import {expect, jest} from "@jest/globals"

const mockEvent = {
  httpMethod: "get",
  body: "",
  headers: {},
  isBase64Encoded: false,
  multiValueHeaders: {},
  multiValueQueryStringParameters: {},
  path: "/hello",
  pathParameters: {},
  queryStringParameters: {
    returnType: "error"
  },
  requestContext: {
    accountId: "123456789012",
    apiId: "1234",
    authorizer: {},
    httpMethod: "get",
    identity: {
      accessKey: "",
      accountId: "",
      apiKey: "",
      apiKeyId: "",
      caller: "",
      clientCert: {
        clientCertPem: "",
        issuerDN: "",
        serialNumber: "",
        subjectDN: "",
        validity: {notAfter: "", notBefore: ""}
      },
      cognitoAuthenticationProvider: "",
      cognitoAuthenticationType: "",
      cognitoIdentityId: "",
      cognitoIdentityPoolId: "",
      principalOrgId: "",
      sourceIp: "",
      user: "",
      userAgent: "",
      userArn: ""
    },
    path: "/hello",
    protocol: "HTTP/1.1",
    requestId: "c6af9ac6-7b61-11e6-9a41-93e8deadbeef",
    requestTimeEpoch: 1428582896000,
    timeEpoch: 1428582896001,
    resourceId: "123456",
    resourcePath: "/hello",
    stage: "dev"
  },
  resource: "",
  stageVariables: {}
}

const mockStateMachineEvent = {
  body: {},
  headers: {
    "apigw-request-id": "c6af9ac6-7b61-11e6-9a41-93e8deadbeef",
    "nhsd-correlation-id": "test-request-id.test-correlation-id.rrt-5789322914740101037-b-aet2-20145-482635-2",
    "nhsd-nhslogin-user": "P9:9912003071",
    "nhsd-request-id": "test-request-id",
    "x-correlation-id": "test-correlation-id",
    "x-request-id": "test-request-id"
  },
  querystring: {},
  path: {}
}

describe("Middy Error Handler", () => {
  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date("2015-04-09T12:34:56.001Z"))
  })

  test("Middleware logs all error details", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type ErrorLogger = (error: any, message: string) => void
    const mockErrorLogger: jest.MockedFunction<ErrorLogger> = jest.fn()
    const mockLogger = {
      error: mockErrorLogger
    }

    const handler = middy(() => {
      throw new Error("error running lambda")
    })

    handler.use(errorHandler({logger: mockLogger}))

    await handler({}, {})

    expect(mockErrorLogger).toHaveBeenCalledTimes(1)

    const [errorObject, errorMessage] = mockErrorLogger.mock.calls[mockErrorLogger.mock.calls.length - 1]
    expect(errorMessage).toBe("Error: error running lambda")
    expect(errorObject.error.name).toBe("Error")
    expect(errorObject.error.message).toBe("error running lambda")
    expect(errorObject.error.stack).not.toBeNull()
  })

  test.each([
    {
      event: mockEvent,
      description: "Middleware returns details as valid fhir from apigw event"
    },
    {
      event: mockStateMachineEvent,
      description: "Middleware returns details as valid fhir from step function event"
    }
  ])("$description", async ({event}) => {
    const mockLogger = {
      error: jest.fn(() => {})
    }

    const handler = middy(() => {
      throw new Error("error running lambda")
    })

    handler.use(errorHandler({logger: mockLogger}))

    const response = await handler(event, {})
    expect(response.statusCode).toBe(500)
    expect(JSON.parse(response.body)).toMatchObject({
      id: "c6af9ac6-7b61-11e6-9a41-93e8deadbeef",
      meta: {
        lastUpdated: "2015-04-09T12:34:56.001Z"
      },
      resourceType: "OperationOutcome",
      issue: [
        {
          severity: "fatal",
          code: "exception",
          details: {
            coding: [
              {
                code: "SERVER_ERROR",
                display: "500: The Server has encountered an error processing the request.",
                system: "https://fhir.nhs.uk/CodeSystem/http-error-codes"
              }
            ]
          }
        }
      ]
    })
  })

  test("Returns a response with the correct MIME type", async () => {
    const mockLogger = {
      error: jest.fn(() => {})
    }
    const handler = middy(() => {
      throw new Error("error running lambda")
    })
    handler.use(errorHandler({logger: mockLogger}))

    const response = await handler(mockEvent, {})

    expect(response.headers).toEqual({
      "Content-Type": "application/fhir+json",
      "Cache-Control": "no-cache"
    })
  })

})
