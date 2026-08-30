import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

/**
 * A custom business exception that will be returned to the client as a 400 Bad Request.
 */
export class BusinessException extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = "BusinessException";
    this.statusCode = statusCode;
  }
}

/**
 * Higher-Order Function to wrap Next.js Route Handlers with global error catching,
 * sanitized error responses, and internal logging.
 *
 * @param handler The original Next.js Route Handler function
 * @returns A wrapped Route Handler function
 */
export function withErrorHandler(handler: Function) {
  return async (request: Request, context: any) => {
    try {
      return await handler(request, context);
    } catch (error: any) {
      const errorId = uuidv4();
      
      // 1. Secure Internal Logging (Log the full stack trace and request details)
      console.error(
        `[ErrorID: ${errorId}] Unhandled Exception at ${request.method} ${request.url}\n`,
        error.stack || error
      );
      
      // 2. Handle known Business Exceptions (safe to show to the client)
      if (error instanceof BusinessException) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }

      // 3. Sanitized Client Response (Hide internal stack traces)
      return NextResponse.json(
        {
          error: "Internal Server Error",
          message: "An unexpected error occurred. Our team has been notified.",
          error_id: errorId,
        },
        { status: 500 }
      );
    }
  };
}
