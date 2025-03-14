import { Book, Brain, Hexagon, YoutubeIcon } from 'lucide-react';

export type MentorGroupId =
  | 'academic'
  | 'github'
  | 'youtube'
  | 'chat'
  | 'brain';

export const mentorGroup = [
  {
    id: 'chat' as const,
    name: 'Chat',
    description: 'Talk to Mentor directly.',
    icon: Hexagon,
    show: true,
  },
  {
    id: 'academic' as const,
    name: 'Academic',
    description: 'Search academic papers.',
    icon: Book,
    show: true,
  },
  {
    id: 'youtube' as const,
    name: 'Youtube',
    icon: YoutubeIcon,
    description: 'Search Youtube videos in real-time.',
    show: true,
  },
  {
    id: 'brain' as const,
    name: 'Brain',
    description: 'Your personal memory companion',
    icon: Brain,
    show: true,
  },
];

export type MentorGroup = (typeof mentorGroup)[number];
