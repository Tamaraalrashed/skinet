using System.Collections.Concurrent;
using Core.Entities;
using Core.Interfaces;

namespace Infrastructure.Data;

public class UnitOfWork(StoreContext context):IUnitOfWork
{
    private  readonly ConcurrentDictionary<string,object> _repositories=new ConcurrentDictionary<string, object>();
    public void Dispose()
    {
context.Dispose();

    }

    public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity
    {
       var type= typeof(TEntity).Name;
       return (IGenericRepository<TEntity>)_repositories.GetOrAdd(type, t =>
       {
           var repoType = typeof(GenericRepository<>).MakeGenericType(typeof(TEntity));
           return Activator.CreateInstance(repoType, context) ??
                  throw new  InvalidOperationException($"Cannot create instance of type {t}");
       });
    }

    public async Task<bool> Complete()
    {
       return await context.SaveChangesAsync()>0;
    }
}