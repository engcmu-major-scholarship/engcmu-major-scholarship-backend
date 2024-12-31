import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateScholarshipDto {
    @IsString()
    readonly name: string
    @IsString()
    readonly description: string
    @IsString()
    readonly requirement: string
    @IsOptional()
    @IsNumber()
    readonly defaultBudget?: number
    @IsString()
    readonly scholarDoc: string
    // readonly scholarDoc: Express.Multer.File
    @IsString()
    readonly appDoc: string
    // readonly appDoc: Express.Multer.File
    @IsBoolean()
    readonly published: boolean
}
