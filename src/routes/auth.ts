import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { users } from '../db/schema';
import db from '../db';

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // Find the user by username
      const user = await db
        .select()
        .from(users)
        .where(eq(users.username,username))
        .execute()
        .then(res => res[0]);

      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      // Validate password
      const isValidPassword = user.password ? bcrypt.compare(password, user.password) : false;
      if (!isValidPassword) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

// Serialize user to store data in the session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id:number, done) => {
  try {
      // Find the user by username
    if( !Number.isInteger(id)) { 
        throw new Error("")
    }
    const user = await db
    .select()
        .from(users)
        .where(eq(users.id,id))
        .execute()
        .then(res => res[0]);

    done(null, user);
  } catch (error) {
    done(error);
  }
});
