type UserProfileType = {
  _id: string;
  username: string;
  displayName: string;
  bio?: string;
  image?: string;
};

type NoteType = {
  _id: string;
  title?: string;
  content: string;
  isPublic: boolean;
  createdAt: string;
  author: string | (UserProfileType & { _id?: string });
  emotion: { label: string; score: number }[] | null;
  likes: number;
};