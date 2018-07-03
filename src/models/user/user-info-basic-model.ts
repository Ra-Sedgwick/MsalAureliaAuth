export class UserInfoBasicModel {

    public userId: number;
    public firstName: string;
    public lastName: string;
    public displayName: string;
    public emailAddress: string;
    public phoneNumber: string;
    public isActive: boolean;
    public isChecked: boolean;
    public userName: string;
    public jobTitle: string;
    public userRole: string;

    mapJsonToModel(jsonObj) {
        this.userId = jsonObj.UserId;
        this.firstName = jsonObj.FirstName;
        this.lastName = jsonObj.LastName;
        this.displayName = jsonObj.DisplayName;
        this.emailAddress = jsonObj.EmailAddress;
        this.phoneNumber = jsonObj.PhoneNumber;
        this.isActive = jsonObj.isActive;
        this.userName = jsonObj.UserName;
        this.jobTitle = jsonObj.JobTitle;
        this.userRole = jsonObj.UserRole;
    }
}
