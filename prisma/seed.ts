// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create guest user
  const hashedPassword = await bcrypt.hash('GuestDemo2024!', 10);
  
  const guest = await prisma.user.upsert({
    where: { email: 'guest@workouttracker.com' },
    update: {},
    create: {
      email: 'guest@workouttracker.com',
      password: hashedPassword,
      userName: 'guest_user',
      name: 'Guest User',
      isGuest: true,
    },
  });

  console.log({ guest });

  // Add some sample workout data for the guest account
  const workout = await prisma.workout.create({
    data: {
      title: 'Sample Chest Day',
      date: new Date(),
      notes: 'This is a sample workout to demonstrate the app!',
      userId: guest.id,
      exercises: {
        create: [
          {
            exerciseName: 'Flat Bench Press',
            muscleGroup: 'Chest',
            sets: {
              create: [
                { weight: 135, reps: 10 },
                { weight: 185, reps: 8 },
                { weight: 225, reps: 6 },
              ],
            },
          },
          {
            exerciseName: 'Incline Bench Press',
            muscleGroup: 'Chest',
            sets: {
              create: [
                { weight: 135, reps: 10 },
                { weight: 155, reps: 8 },
                { weight: 175, reps: 6 },
              ],
            },
          },
        ],
      },
    },
  });

  console.log({ workout });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });