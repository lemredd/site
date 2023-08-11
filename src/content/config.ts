import { z as Validator, defineCollection } from "astro:content";

const valid_subcategories = [
	// Experiences
	"individual",
	"collaborative",
	"certifications",

] as const;
type ValidSubcategory = typeof valid_subcategories[number];
const is_valid_subcategory = (subcategory: string): subcategory is ValidSubcategory => valid_subcategories.indexOf(subcategory as ValidSubcategory) !== -1;
const category_item = Validator.object({
	"item-title": Validator.string().refine(is_valid_subcategory),
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
