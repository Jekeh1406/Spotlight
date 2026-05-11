import {UserStat} from './user-stat';
import {MemberStat} from './member-stat';

export interface GroupStatistics {
  nicest: UserStat | null;
  meanest: UserStat | null;
  mostGenerous: UserStat | null;
  mostCritical: UserStat | null;
  members: MemberStat[];
}
