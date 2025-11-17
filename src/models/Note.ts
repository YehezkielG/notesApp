import { Schema, model, models } from 'mongoose';

// Ini adalah "Cetak Biru" untuk collection 'notes' Anda
// Ini akan menyimpan Personal Diary DAN Public Notes
const NoteSchema = new Schema({
  // Teks dari catatan
  content: {
    type: String,
    required: true,
  },
  
  // Penulis catatan (merujuk ke model 'User')
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Ini adalah 'relasi' ke collection 'users'
    required: true,
  },

  // Bendera untuk membedakan catatan
  isPublic: {
    type: Boolean,
    default: false, // Default-nya, semua catatan adalah pribadi
  },

  // Data dari AI Emotion Labeling
  emotion: {
    type: String,
    default: 'neutral',
  },
  
  // (Fitur masa depan dari proposal Anda)
  tags: [String],
  likes: {
    type: Number,
    default: 0,
  },
  
}, {
  timestamps: true, // Otomatis menambah createdAt dan updatedAt
});

const Note = models.Note || model('Note', NoteSchema);

export default Note;