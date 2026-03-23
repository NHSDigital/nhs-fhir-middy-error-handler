import middy from "@middy/core"
import {Logger} from "@aws-lambda-powertools/logger"
import {injectLambdaContext} from "@aws-lambda-powertools/logger/middleware"

const logger = new Logger({serviceName: "type-compat-repro"})

const middlewareList: Array<middy.MiddlewareObj> = [
  injectLambdaContext(logger, {clearState: true})
]

void middlewareList
