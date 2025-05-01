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