using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.Users
{
    public interface IUserRepository : IRepository<User, UserId>
    {
        public Task<List<User>> GetUserAsync(Guid? userId = null);
        public Task<User>GetByUsernameAsync(string username);
        Task<User> UpdateAsync(User user);

    }
}