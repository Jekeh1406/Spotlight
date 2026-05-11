import {GroupMember} from './group-member';

export interface Group {
  id: number;
  name: string;
  code: string;
  createdAt: string;
  ownerId: number;
  members: GroupMember[];
}
