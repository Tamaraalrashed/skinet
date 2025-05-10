using System.Linq.Expressions;
using Core.Interfaces;

namespace Core.Specifications;

public class BaseSpecification<T>(Expression<Func<T, bool>>? criteria) : ISpecification<T>
{
    protected BaseSpecification(): this(null){}
    
    public Expression<Func<T, bool>>? Criteria => criteria;
    public Expression<Func<T, object>>? OrderBy { get; private set; }
    public Expression<Func<T, object>>? OrderByDescending { get; private set; }
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

    protected void SetOrderBy(Expression<Func<T, object>> orderBy)
    {
        OrderBy = orderBy;
    } 
    protected void SetOrderByDesc(Expression<Func<T, object>> orderByDescending)
    {
        orderByDescending = orderByDescending;
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