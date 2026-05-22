import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  ageVerified: boolean;
  birthDate: string | null;
  loyaltyPoints: number;
  referralCode: string | null;
  
  // Actions
  setAgeVerified: (verified: boolean, dob: string | null) => void;
  setLoyaltyPoints: (points: number) => void;
  setReferralCode: (code: string | null) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ageVerified: false,
      birthDate: null,
      loyaltyPoints: 0,
      referralCode: null,
      
      setAgeVerified: (verified, dob) => {
        set({ ageVerified: verified, birthDate: dob });
      },
      
      setLoyaltyPoints: (points) => {
        set({ loyaltyPoints: points });
      },
      
      setReferralCode: (code) => {
        set({ referralCode: code });
      },
    }),
    {
      name: 'nextshot-user', // Persist user verification details in local storage
    }
  )
);
