using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.Clientes
{
    public class Cliente : Entity<ClienteId>, IAggregateRoot
    {
        
        public EmailCliente EmailCliente {get; private set;}
        public MoradaCliente MoradaCliente {get; private set;}
        public NomeCliente NomeCliente { get; private set; }
        private Cliente() { }
        public Cliente(
            NomeCliente nomeCliente,
            EmailCliente emailCliente,
            MoradaCliente moradaCliente
        )
        {
            if (nomeCliente == null)
            throw new BusinessRuleValidationException("NomeCliente cannot be null.");

            if (emailCliente == null)
            throw new BusinessRuleValidationException("EmailCliente cannot be null.");

            if (moradaCliente == null)
            throw new BusinessRuleValidationException("MoradaCliente cannot be null.");

            this.Id = new ClienteId(Guid.NewGuid());
            this.NomeCliente = nomeCliente;
            this.EmailCliente = emailCliente;
            this.MoradaCliente = moradaCliente;
        }
    }
}