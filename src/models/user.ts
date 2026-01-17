import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt';

export interface IUser {
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    firstName?: string;
    lastName?: string;
    socialLinks?: {
        website?: string;
        facebook?: string;
        linkedin?: string;
        instagram?: string;
        x?: string;
        youtube?: string;
    }
}

const userSchema = new Schema<IUser> ({
    username: {
        type: String,
        required: [true, 'Korisnicko ime je obavezno'],
        maxLength: [20, 'Korisnicko ime mora biti manje od 20 slova'],
        unique: [true, 'Korisnicko ime mora biti jedinstveno'],
    },
    email: {
        type: String,
        required: [true, 'Email ime je obavezno'],
        maxLength: [50, 'Email mora sadrzati manje od 50 slova'],
        unique:  [true, 'Email mora biti jedinstven'],
    },
    password: {
        type: String,
        required: [true, 'Lozinka je obavezna!'],
        select: false,
    },
    role: {
        type: String,
        required: [true, 'Role je obavezno polje'],
        enum: {
            values: ['admin', 'user'],
            message: '{VALUE} nije dozvoljena/podrzana'
        },
        default: 'user',
    },
    firstName: {
        type: String,
        maxLength: [20, 'Korisnicko ime mora biti manje od 20 slova'], 
    },
    lastName: {
        type: String,
        maxLength: [20, 'Prezime mora biti manje od 20 slova']
    },
    socialLinks: {
        website: {
            type: String,
            maxLength: [80, 'Website URL mora biti manje od 80 slova']
        },
        facebook: {
            type: String,
            maxLength: [80, 'Facebook URL mora biti manje od 80 slova']
        },
        linkedin: {
            type: String,
            maxLength: [80, 'Linkedin URL mora biti manje od 80 slova']
        },
        instagram: {
            type: String,
            maxLength: [80, 'Instagram URL mora biti manje od 80 slova']
        },
        x: {
            type: String,
            maxLength: [80, 'X URL mora biti manje od 80 slova']
        },
        youtube: {
            type: String,
            maxLength: [80, 'Youtube URL mora biti manje od 80 slova']
        },
    },
})

userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    
    try {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    } catch (error) {
        throw error;
    }
}); 

export default model<IUser>('User', userSchema);