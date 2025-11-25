type UserProfileType = {
  _id: string;
  username: string;
  displayName: string;
  bio?: string;
  image?: string;
};

type NoteResponseReply = {
  text: string;
  likes: number;
};

type NoteResponse = {
  text: string;
  likes: number;
  replies: NoteResponseReply[];
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
  likedBy?: (string | { toString(): string })[];
  tags?: string[];
  responses: NoteResponse[];
};