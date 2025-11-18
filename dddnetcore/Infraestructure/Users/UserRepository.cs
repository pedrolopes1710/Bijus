using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
            IQueryable<User> query = _context.Users.Include(u => u.Cliente);

            if (clienteId == null)
                return await query.ToListAsync();

            var clienteVo = new ClienteId(clienteId.Value);
            query = query.Where(user => user.Cliente != null && user.Cliente.Id.Equals(clienteVo));

            return await query.ToListAsync();
        }

        public Task<User?> GetUserByClientAsync(Guid? clienteId = null)
        {
            if (clienteId == null) return Task.FromResult<User?>(null);

            var clienteVo = new ClienteId(clienteId.Value);
            return _context.Users
                .Include(u => u.Cliente)
                .FirstOrDefaultAsync(user => user.Cliente != null && user.Cliente.Id.Equals(clienteVo));
        }

        public async Task<User?> GetByUsernameOrEmailAsync(string userOrEmail)
        {
            if (string.IsNullOrWhiteSpace(userOrEmail)) return null;
            var val = userOrEmail.Trim().ToLower();

            // 1) Procura por username
            var byUserName = await _context.Users
                .Include(u => u.Cliente)
                .FirstOrDefaultAsync(u => u.UserName != null
                                        && u.UserName.Nome != null
                                        && u.UserName.Nome.ToLower() == val);

            if (byUserName != null) return byUserName;

            // 2) Procura por email no cliente (se existir)
            var byEmail = await _context.Users
                .Include(u => u.Cliente)
                .FirstOrDefaultAsync(u => u.Cliente != null
                                        && u.Cliente.EmailCliente != null
                                        && u.Cliente.EmailCliente.Email != null
                                        && u.Cliente.EmailCliente.Email.ToLower() == val);

            return byEmail;
        }

        public async Task<User> UpdateAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return user;
        }

        // se a base tem virtual, use override; se não, mantenha new mas documente
        public new async Task<List<User>> GetAllAsync() {
            return await _context.Users
                .Include(o => o.Cliente)
                .ToListAsync();
        }
    }
}