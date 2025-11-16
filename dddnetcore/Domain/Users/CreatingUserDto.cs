namespace dddnetcore.Domain.Users
{
    public class CreatingUserDto
    {
        public string UserName { get; set; }
        public string UserPassword { get; set; }
        public Guid ClienteId { get; set; }
    }
}