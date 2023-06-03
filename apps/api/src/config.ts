import { ConfigService } from "@nestjs/config";
import { app } from "./app";


export interface IConfiguration {
	blogDirectory: string;
}


export default () =>({
	blogDirectory: process.env.BLOG_DIRECTORY ?? "",
} as IConfiguration)


export const getConfig = (): ConfigService<IConfiguration> => {
	return app.get<ConfigService<IConfiguration>>(ConfigService);
}