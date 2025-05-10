using System.Net;
using System.Text.Json;

namespace API.MiddleWare;

public class ExceptionMiddleware(IHostEnvironment env,RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext httpContext)
    {
        try
        {
        await next(httpContext);
        }
        catch (Exception ex)
        {
            await HandleCannotBeOpenedException(httpContext, ex, env);
            throw;
        }
    }

    private static Task HandleCannotBeOpenedException(HttpContext context, Exception exception, IHostEnvironment env)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;


        var response = env.IsDevelopment()
            ? new ApiErrorResponse(context.Response.StatusCode, exception.Message,exception.StackTrace)
            : new ApiErrorResponse(context.Response.StatusCode, exception.Message, "Internal Server Error");
    
        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        var json = JsonSerializer.Serialize(response, options);
        return context.Response.WriteAsync(json);

    }
    
}