using System.Linq.Expressions;
using Core.Interfaces;

namespace Core.Specifications;

public class BaseSpecification<T>(Expression<Func<T, bool>>? criteria) : ISpecification<T>
{
    protected BaseSpecification(): this(null){}
    
    public Expression<Func<T, bool>>? Criteria => criteria;
    public Expression<Func<T, object>>? OrderBy { get; private set; }
    public Expression<Func<T, object>>? OrderByDescending { get; private set; }
    public List<Expression<Func<T, object>>> Includes { get; } = [];
    public List<string> IncludeStrings { get; } = [];
    public bool IsDistinct { get; private set; }
    public int Take { get; private set; }
    public int Skip { get; private set; }
    public bool IsPaginationEnabled { get; private set; }
    public IQueryable<T> ApplyCriteria(IQueryable<T> query)
    {
        if (criteria != null)
        {
            return query.Where(criteria);
        }
        return query;
    }

    protected void SetIncludes(Expression<Func<T, object>> includesExp)
    {
        Includes.Add(includesExp);
    }  
    protected void SetIncludes(string includesStr)
    {
        IncludeStrings.Add(includesStr);
    } 
    protected void SetOrderBy(Expression<Func<T, object>> orderBy)
    {
        OrderBy = orderBy;
    } 
    protected void SetOrderByDesc(Expression<Func<T, object>> orderByDesc)
    {
        OrderByDescending = orderByDesc;
    }

    protected void SetIsDistinct()
    {
        IsDistinct = true;
    }
    protected void SetIsPaginationEnabled(int skip, int take)
    {
        Skip = skip;
        Take = take;
        IsPaginationEnabled = true;
    }
    
    protected void ApplyOrderByFromString(string orderBy)
    {
        var parts = orderBy.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);

        if (parts.Length == 0) return;

        string propertyName = parts[0];
        string direction = parts.Length > 1 ? parts[1].ToLower() : "asc";

        var parameter = Expression.Parameter(typeof(T), "x");
        
        var property = Expression.PropertyOrField(parameter, propertyName);

        // Convert to object
        var converted = Expression.Convert(property, typeof(object));
        var lambda = Expression.Lambda<Func<T, object>>(converted, parameter);

        if (direction == "desc")
            SetOrderByDesc(lambda);
        else
            SetOrderBy(lambda);
    }

}

public class BaseSpecification<T, TResult>(Expression<Func<T,bool>> criteira) : BaseSpecification<T>(criteira),
    ISpecification<T, TResult>
{
    protected BaseSpecification(): this(null!){}
    public Expression<Func<T, TResult>>? Select { get; private set; }

    protected void SetSelect(Expression<Func<T, TResult>>? selectExpression)
    {
        Select = selectExpression;
    }
}