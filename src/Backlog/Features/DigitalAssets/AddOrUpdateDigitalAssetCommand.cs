using MediatR;
using Backlog.Data;
using Backlog.Model;
using System.Threading.Tasks;
using System.Data.Entity;
using Backlog.Features.Core;

namespace Backlog.Features.DigitalAssets
{
    public class AddOrUpdateDigitalAssetCommand
    {
        public class Request : IRequest<Response>
        {
            public DigitalAssetApiModel DigitalAsset { get; set; }
        }

        public class Response { }

        public class AddOrUpdateDigitalAssetHandler : IAsyncRequestHandler<Request, Response>
        {
            public AddOrUpdateDigitalAssetHandler(IBacklogContext context, ICache cache)
            {
                _context = context;
                _cache = cache;
            }

            public async Task<Response> Handle(Request request)
            {
                var entity = await _context.DigitalAssets
                    .SingleOrDefaultAsync(x => x.Id == request.DigitalAsset.Id && x.IsDeleted == false);
                if (entity == null) _context.DigitalAssets.Add(entity = new DigitalAsset());
                entity.Name = request.DigitalAsset.Name;
                entity.Folder = request.DigitalAsset.Folder;
                await _context.SaveChangesAsync();

                return new Response() { };
            }

            private readonly IBacklogContext _context;
            private readonly ICache _cache;
        }
    }
}
