import { NextResponse } from 'next/server';
import connectDb from '@/lib/db'; // 👈 Impor koneksi DB-mu
import Counter from '@/models/Counter'; // 👈 Impor Model Counter-mu

const COUNTER_ID = "nigga"; // ID unik untuk dokumen kita

export async function POST() {
    try {
      await connectDb();
  
      const updatedCounter = await Counter.findOneAndUpdate(
        { name: COUNTER_ID },
        { $inc: { count: 1 } }, // 👈 
        { new: true, upsert: true }
      );
  
      return NextResponse.json(updatedCounter, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
  }

  export async function GET() {
    try {
      await connectDb();
  
      // 1. Cari dokumen counter kita
      let counter = await Counter.findOne({ name: COUNTER_ID });
  
      // 2. Jika belum ada, buat baru
      if (!counter) {
        counter = new Counter({
          name: COUNTER_ID,
          count: 0,
        });
        await counter.save();
      }
  
      return NextResponse.json(counter, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
  }