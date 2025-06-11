using API.DTOs;
using Core.Entities;

namespace API.Extensions;

public static class AddressMappingExtension
{
    public static AddressDto? ToDto(this Address? address)
    {
        if(address == null) return null;
        return new AddressDto()
        {
            Line1 = address.Line1,
            Line2 = address.Line2,
            State = address.State,
            PostalCode = address.PostalCode,
            City = address.City,
            Country = address.Country,
        };

    } 
    
    public static Address? ToEntity(this AddressDto? addressDto)
    {
        if(addressDto == null) return null;
        
        return new Address()
        {
            Line1 = addressDto.Line1,
            Line2 = addressDto.Line2,
            State = addressDto.State,
            PostalCode = addressDto.PostalCode,
            City = addressDto.City,
            Country = addressDto.Country,
        };

    }
    
    public static void UpdateAddress(this Address address, AddressDto addressDto)
    {
        if(address == null) throw new ArgumentNullException(nameof(address));
        if(addressDto == null) throw new ArgumentNullException(nameof(addressDto));
        
      
           address. Line1 = addressDto.Line1;
           address. Line2 = addressDto.Line2;
           address. State = addressDto.State;
           address.  PostalCode = addressDto.PostalCode;
           address.  City = addressDto.City;
           address. Country = addressDto.Country;
       

    }
}