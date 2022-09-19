import { Page } from "@playwright/test";

export class Signup {
    public static readonly PASSWORD: string = "//input[@name='inpPassword']";
    public static readonly PASSWORD_CONFIRM: string = "//input[@name='inpConfirmPassword']";
    public static readonly SIGNUP_BUTTON: string = "//button[text()='Sign up']";
    public static readonly CONTINUE_BUTTON: string = "//button[text()='Continue']";
    public static readonly GO_TO_LOGIN_BUTTON: string = "//button[@name='btnredirectToLogin']";

    public static commonPassword(){
        return "Qwerty1234$";
    }

    public static async enterOTP(page: Page, code: string): Promise<void> {
        await page.click("//input[@name='inpOtp1']");
        for (const singleDigit of Array.from(code)) {
            await page.keyboard.type(singleDigit, {delay: 300});
        }
    }
}