using System.Security.Authentication;
using System.Security.Claims;
using Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class ClaimsPrincipleExtensions
{
    public static async Task<AppUser> GetUserByEmail(this UserManager<AppUser> userManager, ClaimsPrincipal principal)
    {
        var user = await userManager.Users.FirstOrDefaultAsync(x=>x.Email==
                                                             principal.GetEmail());
        if (user is null) 
            throw new AuthenticationException("User is not found");
        return user;
    }
    
    public static async Task<AppUser> GetUserByEmailWithAddress(this UserManager<AppUser> userManager, ClaimsPrincipal principal)
    {
        var user = await userManager.Users.Include("Address")
            .FirstOrDefaultAsync(x=>x.Email==
                                    principal.GetEmail());
        if (user is null) 
            throw new AuthenticationException("User is not found");
        return user;
    }

    private static string GetEmail(this ClaimsPrincipal principal)
    {
        return principal.FindFirstValue(ClaimTypes.Email)??
               throw new AuthenticationException("No email claim");
    }
    
}