import { z as Validator, defineCollection } from "astro:content";

const valid_subcategories = [
	// Experiences
	"individual",
	"collaborative",
	"certifications",

] as const;
const category_item = Validator.object({
	"item-title": Validator.string(),
	"item-subcategory": Validator.string(),
	"item-link": Validator.string().url().optional()
});

const about = defineCollection({
	"type": "data",
	"schema": Validator.object({
		"category-items": Validator.array(category_item)
	})
});

export const collections = {
	about
};
