import type { Habit } from '../../../../domain/models/habit';

export interface HabitDto {
  id: string;
  name: string;
  emoji: string | null;
  description: string;
  dates: number[]; // array of timestamps in seconds
  created_at: number; // timestamp in seconds
  updated_at: number; // timestamp in seconds
}

function mapDtoToModel (dto: HabitDto): Habit {
  return {
    id: dto.id,
    name: dto.name,
    emoji: dto.emoji || undefined,
    dates: dto.dates.map(date => date * 1000),
    description: dto.description,
    createdAt: dto.created_at * 1000,
    updatedAt: dto.updated_at * 1000,
  };
}

function mapModelFieldsToDto (fields: Partial<Habit>): Partial<HabitDto> {
  const mappers: Record<string, { fn: (value: any) => any; fieldName: string }> = {
    id: {
      fieldName: 'id',
      fn: (value: Habit['id']) => value,
    },
    name: {
      fieldName: 'name',
      fn: (value: Habit['name']) => value,
    },
    emoji: {
      fieldName: 'emoji',
      fn: (value: Habit['emoji']) => value || null,
    },
    dates: {
      fieldName: 'dates',
      fn: (value: Habit['dates']) => value.map(timestamp => Math.round(timestamp / 1000)),
    },
    description: {
      fieldName: 'description',
      fn: (value: Habit['description']) => value,
    },
    createdAt: {
      fieldName: 'created_at',
      fn: (value: Habit['createdAt']) => Math.round(value / 1000),
    },
    updatedAt: {
      fieldName: 'updated_at',
      fn: (value: Habit['updatedAt']) => Math.round(value / 1000),
    },
  }

  return Object.entries(fields).reduce((acc: Record<string, any>, entry) => {
    const [name, value] = entry;
    const { fieldName, fn } = mappers[name];
    acc[fieldName] = fn(value);

    return acc;
  }, {}) as Partial<HabitDto>;
}

export const mappers = {
  dtoToModel: mapDtoToModel,
  partialModelToDto: mapModelFieldsToDto,
};