import {MiddlewareObj} from "@middy/core"
import {Logger} from "@aws-lambda-powertools/logger"

type ResponseBody = {
  resourceType: string
  id?: string
  meta?: {
    lastUpdated: Date
  }
  issue: Array<{
    severity: string
    code: string
    details: {
      coding: Array<{
        system: string
        code: string
        display: string
      }>
    }
  }>
}

type MockLogger = {
  error: (error: Error, message: string) => void
}
// eslint-disable-next-line no-undef
type HandlerLogger = Console | MockLogger | Logger
type LoggerAndLevel = {
  logger?: HandlerLogger
  level?: string
}
function errorHandler({logger = console, level = "error"}: LoggerAndLevel) {
  return {
    onError: async (handler) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error: any = handler.error
      const requestId = handler.event.requestContext?.requestId ?? handler.event.headers?.["apigw-request-id"] ?? null
      const timeEpoch = handler.event.requestContext?.timeEpoch ?? Date.now()

      // if there are a `statusCode` and an `error` field
      // this is a valid http error object
      if (typeof logger[level] === "function") {
        logger[level](
          {
            error: ((e) => ({
              name: e.name,
              message: e.message,
              stack: e.stack,
              details: e.details,
              cause: e.cause,
              status: e.status,
              statusCode: e.statusCode,
              expose: e.expose
            }))(error)
          },
          `${error.name}: ${error.message}`
        )
      }

      const responseBody: ResponseBody = {
        resourceType: "OperationOutcome",
        issue: [
          {
            severity: "fatal",
            code: "exception",
            details: {
              coding: [
                {
                  system: "https://fhir.nhs.uk/CodeSystem/http-error-codes",
                  code: "SERVER_ERROR",
                  display: "500: The Server has encountered an error processing the request."
                }
              ]
            }
          }
        ]
      }

      if (requestId !== null) {
        responseBody.id = requestId
      }
      if (timeEpoch !== null) {
        responseBody.meta = {
          lastUpdated: new Date(timeEpoch)
        }
      }

      handler.response = {
        statusCode: 500,
        body: JSON.stringify(responseBody),
        headers: {
          "Content-Type": "application/fhir+json",
          "Cache-Control": "no-cache"
        }
      }
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } satisfies MiddlewareObj<any, any, Error, any>
}

export default errorHandler
