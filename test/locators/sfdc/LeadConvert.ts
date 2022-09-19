export class LeadConvert {
    public static readonly CONVERT_BUTTON: string = "//button[descendant::span[text()='Convert']]";
    public static readonly OPPORTUNITY_LINK: string = "(//a[@data-refid='recordId' and ancestor::div[contains(@class, 'primaryField')] and ancestor::div[descendant::div[text()='Opportunity']]])[last()]";
}