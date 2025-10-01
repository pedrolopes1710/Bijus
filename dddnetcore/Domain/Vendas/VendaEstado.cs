using System;
using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.Vendas;
public enum VendaEstado{
    pendente,
    paga,
    enviada,
    entregue,
    cancelada
}