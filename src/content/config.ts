import { z as Validator, defineCollection } from "astro:content";

const category_item = Validator.object({
	"item-title": Validator.string(),
	"item-link": Validator.string().optional() // TODO: validate link
});

const about = defineCollection({
	"type": "data",
	"schema": Validator.object({
		"category": Validator.string(),
		"category-items": Validator.array(category_item)
	})
});

export const collections = {
	about
};
