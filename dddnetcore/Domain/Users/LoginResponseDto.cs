namespace dddnetcore.Domain.Users
{
    public class LoginResponseDto
    {
        public string Token { get; set; }
        public UserDto User { get; set; }
        public bool IsAdmin { get; set; }
        public string Role { get; set; }
    }
}