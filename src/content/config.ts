import { z as Validator, defineCollection } from "astro:content";

const about = defineCollection({
	"type": "data",
	"schema": Validator.object({
		"category": Validator.string(),
	})
});

export const collections = {
	about
};
