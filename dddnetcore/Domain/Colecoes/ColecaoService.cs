using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Categorias;
using dddnetcore.Domain.FotoProdutos;
using dddnetcore.Domain.Produtos;
using dddnetcore.Domain.FotoColecoes;
using Microsoft.AspNetCore.Hosting;

namespace dddnetcore.Domain.Colecoes
{
    public class ColecaoService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IColecaoRepository _repo;
        private readonly IProdutoRepository _produtoRepo;
        private readonly IFotoColecaoRepository _fotoColecaoRepo;
        private readonly IWebHostEnvironment _env;

        public ColecaoService(IUnitOfWork unitOfWork, IColecaoRepository repo, IFotoColecaoRepository fotoColecaoRepo, IProdutoRepository produtoRepo, IWebHostEnvironment env)
        {   
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            this._fotoColecaoRepo = fotoColecaoRepo;
            this._produtoRepo = produtoRepo;
            this._env = env;
        }

        public async Task<List<ColecaoDto>> GetAllAsync()
        {
            return (await this._repo.GetAllAsync()).ConvertAll(colecao => new ColecaoDto(colecao));
        }

        public async Task<ColecaoDto> GetByIdAsync(ColecaoId id)
        {
            var colecao = await this._repo.GetByIdAsync(id);
            return colecao == null ? null : new ColecaoDto(colecao);
        }

        public async Task<ColecaoDto> AddAsync(CreatingColecaoDto dto)
        {
            if (!Enum.TryParse<EstadoColecao>(dto.EstadoColecao, out var status))
            {
                throw new BusinessRuleValidationException($"Status inválido: {dto.EstadoColecao}");
            }
            var colecao = new Colecao(
                new NomeColecao(dto.NomeColecao),
                new DescricaoColecao(dto.DescricaoColecao),
                new DataCriacaoColecao(dto.DataAtualizacao),
                new DataAtualizacaoColecao(dto.DataCriacao),
                status
            );

            await this._repo.AddAsync(colecao);
            await this._unitOfWork.CommitAsync();

            if (dto.Fotos != null && dto.Fotos.Any())
            {
                foreach (var foto in dto.Fotos)
                {
                    var fileName = $"{Guid.NewGuid()}{Path.GetExtension(foto.FileName)}";
                    var folderPath = Path.Combine(_env.WebRootPath, "uploads", "colecoes");

                    Directory.CreateDirectory(folderPath);

                    var filePath = Path.Combine(folderPath, fileName);

                    using var stream = new FileStream(filePath, FileMode.Create);
                    await foto.CopyToAsync(stream);

                    var urlColecao = $"/uploads/colecoes/{fileName}";
                    // 3️⃣ Criar registo FotoColecao
                    var fotoColecao = new FotoColecao
                    (
                        new UrlColecao(urlColecao), colecao.Id
                    );

                    await _fotoColecaoRepo.AddAsync(fotoColecao);
                }

                await _unitOfWork.CommitAsync();
            }
            if (dto.Produtos!= null)
            {
                foreach (var produtoId in dto.Produtos)
                {
                    var produto = await _produtoRepo.GetByIdAsync(new ProdutoId(produtoId));
                    if (produto != null)
                    {
                        produto.SetColecaoId(colecao.Id);
                        await _produtoRepo.UpdateAsync(produto);
                    }
                }
                

                await _unitOfWork.CommitAsync();
            }
            return new ColecaoDto(colecao);
        }

       public async Task<ColecaoDto> UpdateAsync(ColecaoDto dto)
        {
            var colecao = await this._repo.GetByIdAsync(new ColecaoId(dto.Id));

            if (colecao == null)
                return null;

            //produto.ChangeNomeProduto(new NomeProduto(dto.Nome));
            //produto.ChangeDescricaoProduto(new DescricaoProduto(dto.Descricao));
            //produto.ChangePrecoProduto(new PrecoProduto(dto.Preco));

            await this._unitOfWork.CommitAsync();

            return new ColecaoDto(colecao);
        }

        public async Task<ColecaoDto> DeleteAsync(ColecaoId id)
        {
            var colecao = await this._repo.GetByIdAsync(id);

            if (colecao == null)
                return null;

            this._repo.Remove(colecao);
            await this._unitOfWork.CommitAsync();

            return new ColecaoDto(colecao);
        }
    }
}