﻿using System.Collections.Generic;
using System.Linq;

namespace Backlog.Data.Models
{
    public abstract class PrioritizableEntity : IPrioritizable
    {
        public abstract int Id { get; set; }
        public int? Priority { get; set; } = 0;

        public void IncrementPriority(List<IPrioritizable> items)
        {

            foreach (var entity in items.OrderBy(x => x.Priority).ToList())
            {
                if (!entity.Priority.HasValue)
                    entity.Priority = 0;

                if (!this.Priority.HasValue)
                    this.Priority = 0;

                if ((entity.Id != this.Id) && entity.Priority >= this.Priority)
                {
                    this.Priority = entity.Priority + 1;
                    break;
                }
            }
        }

        public void DecrementPriority(List<IPrioritizable> items)
        {
            foreach (var entity in items.OrderByDescending(x => x.Priority).ToList())
            {
                if (!entity.Priority.HasValue)
                    entity.Priority = 0;

                if (!this.Priority.HasValue)
                    this.Priority = 0;

                if ((entity.Id != this.Id) && entity.Priority <= this.Priority)
                {
                    this.Priority = entity.Priority - 1;
                    break;
                }
            }
        }
    }

}
