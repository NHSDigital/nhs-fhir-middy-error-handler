import { MiddlewareObj } from "@middy/core"
import {Logger} from "@aws-lambda-powertools/logger"

type ResponseBody = {
  resourceType: string
  id?: string
  meta?: {
    lastUpdated: Date
  }
  issue: {
    severity: string
    code: string
    details: {
      coding: {
        system: string
        code: string
        display: string
      }[]
    }
  }[]
}

type MockLogger = {
  error: (error: Error, message: string) => void
}
type HandlerLogger = Logger | Console | MockLogger
type LoggerAndLevel = {
  logger?: HandlerLogger
  level?: string
}
function errorHandler ({logger = console, level = "error"}: LoggerAndLevel) {
  return {
  onError: async (handler) => {
    const error: Error | any = handler.error
    const requestId = handler.event.requestContext?.requestId ?? null
    const timeEpoch = handler.event.requestContext?.timeEpoch ?? null

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
        `${error.name ?? ""}: ${error.message ?? ""}`
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
} as MiddlewareObj<any, any, Error, any>
}

export default errorHandler
