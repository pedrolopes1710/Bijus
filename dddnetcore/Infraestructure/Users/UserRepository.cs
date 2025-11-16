using dddnetcore.Domain.Clientes;
using dddnetcore.Domain.Users;
using DDDSample1.Infrastructure;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace dddnetcore.Infraestructure.Users
{
    public class UserRepository : BaseRepository<User, UserId>, IUserRepository
    {
        private readonly DDDSample1DbContext _context;

        public UserRepository(DDDSample1DbContext context) : base(context.Users)
        {
            _context = context;
        }
        public async Task<List<User>> GetUserAsync(Guid? clienteId = null)
        {
            if (clienteId == null) return await GetAllAsync();

            var query = _context.Users.AsQueryable();

            query = query.Where(user => user.Cliente.Id.Equals(new ClienteId(clienteId.Value)))
                .Include(o => o.Cliente);

            return await query.ToListAsync();
        }
        public async Task<User> UpdateAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return user;
        }
        public new async Task<List<User>> GetAllAsync() {
            return await _context.Users
                .Include(o => o.Cliente)
                .ToListAsync();
        }
    }
}