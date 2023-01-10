import type { Goal } from '../../../../domain/models/goal';

export interface GoalDto {
  id: string;
  name: string;
  emoji: string | null;
  description: string;
  inspection_date: number; // timestamp in seconds
  attached_images: Array<{
    url: string,
    description: string;
    attached_at: number; // timestamp in seconds
  }>; 
  habits: Array<{
    id: string;
    attached_at: number; // timestamp in seconds
  }>;
  created_at: number; // timestamp in seconds
  updated_at: number; // timestamp in seconds
}


function mapPartialModelToDto (fields: Partial<Goal>): Partial<GoalDto> {
  const mappers: Record<string, { fn: (value: any) => any; fieldName: string }> = {
    id: {
      fieldName: 'id',
      fn: (value: Goal['id']) => value,
    },
    name: {
      fieldName: 'name',
      fn: (value: Goal['name']) => value,
    },
    emoji: {
      fieldName: 'emoji',
      fn: (value: Goal['emoji']) => value || null,
    },
    description: {
      fieldName: 'description',
      fn: (value: Goal['description']) => value,
    },
    inspectionDate: {
      fieldName: 'inspection_date',
      fn: (value: Goal['inspectionDate']) => value,
    },
    attachedImages: {
      fieldName: 'attached_images',
      fn: (value: Goal['attachedImages']) => value.map(({ url, description, attachedAt }) => ({
        url,
        description,
        attached_at: Math.round(attachedAt / 1000),
      })),
    },
    habits: {
      fieldName: 'habits',
      fn: (value: Goal['habits']) => value.map(({ id, attachedAt }) => ({
        id,
        attached_at: Math.round(attachedAt / 1000),
      })),
    },
    createdAt: {
      fieldName: 'created_at',
      fn: (value: Goal['createdAt']) => Math.round(value / 1000),
    },
    updatedAt: {
      fieldName: 'updated_at',
      fn: (value: Goal['updatedAt']) => Math.round(value / 1000),
    },
  };

  return Object.entries(fields).reduce((acc: Record<string, any>, entry) => {
    const [name, value] = entry;
    
    const { fieldName, fn } = mappers[name];
    acc[fieldName] = fn(value);

    return acc;
  }, {}) as Partial<GoalDto>;
}

function mapDtoToModel (dto: GoalDto): Goal {
  return {
    id: dto.id,
    name: dto.name,
    emoji: dto.emoji || undefined,
    description: dto.description,
    inspectionDate: dto.inspection_date * 1000,
    attachedImages: dto.attached_images.map(({ url, description, attached_at }) => ({
      url,
      description,
      attachedAt: attached_at * 1000,
    })),
    habits: dto.habits.map(({ id, attached_at }) => ({
      id,
      attachedAt: attached_at * 1000,
    })),
    createdAt: dto.created_at * 1000,
    updatedAt: dto.updated_at * 1000,
  };
}

export const mappers = {
  dtoToModel: mapDtoToModel,
  partialModelToDto: mapPartialModelToDto,
};