export interface User {
    user_id: string;
    user_name: string;
    phone_number: number;
    profilePicture?: string;
    email?: string;
    profile: Profile[];
}

export interface Profile {
    _id: string;
    userId: string;
    profileName: string;
    profileNumber: number;
    profileTotalCredit: number;
    profileTotalDebit: number;
    transactionCollection: TransactionCollection[];
    notificationCollection: string[];
    createdAt: string;
    updatedAt: string;
}

export interface TransactionCollection {
    _id: string;
    transactionId: Transaction[];
    createdAt: string;
    updatedAt: string;
}

export interface Transaction {
    _id: string;
    userId: string[];
    transactionPartnerProfilePicture: string;
    transactionPartnerPhoneNumber: number;
    transactionPartnerName: string;
    totalBalance: number;
    transactionAmountDetailId: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    totalCredit: number;
    totalDebit: number;
}

export interface UserContextType {
    user: User | null;
    loading: boolean;
    profileSelected: number;
    setNewProfileSelected: (profileIndex: number) => void;
    setUser: (user: User | null) => void;
    fetchUserDetails: () => Promise<void>;
}

export interface Staff {
    _id: string;
    user: string;
    name: string;
    profileId: string;
    role: string;
    salary: number;
    salaryCycle: string;
    joiningDate: string;
    isActive: boolean;
    contactInfo: {
        phone: string;
    };
    salaryHistory: salaryHistory[];
    createdAt: string;
    updatedAt: string;
}

export interface salaryHistory {
    _id: string;
    staffMember: string;
    amount: number;
    paymentDate: string;
    status: string;
    transaction: string;
    updatedAt: string;
}
