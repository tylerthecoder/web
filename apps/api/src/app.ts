import { INestApplication } from "@nestjs/common";

export let app: INestApplication;

export const setApp = (newApp: INestApplication) => {
	app = newApp;
}