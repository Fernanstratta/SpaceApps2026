import type { ClassroomActivity } from '../../types';
import { TextList } from '../common/TextList';

export function ClassroomActivityList({ activities }: { activities: ClassroomActivity[] }) {
  return (
    <ul className="card-list">
      {activities.map((activity) => (
        <li key={activity.id}>
          <article className="activity-card">
            <h4 className="activity-card__title">{activity.title}</h4>
            <p>{activity.description}</p>
            {activity.durationMinutes !== null ? (
              <p className="activity-card__meta">{activity.durationMinutes} min</p>
            ) : null}
            {activity.materials && activity.materials.length > 0 ? <TextList items={activity.materials} /> : null}
          </article>
        </li>
      ))}
    </ul>
  );
}
