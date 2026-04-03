import { Field, FieldGroup } from "@workspace/ui/components/field";
import z from "zod";

const createAdminSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    user: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string().email(),
        emailVerified: z.date().nullable(),
        image: z.string().url().nullable(),
        createdAt: z.date(),
        updatedAt: z.date(),
    }).optional()
})

const CreateAdminForm = () => {
    return (
        <form action="">
            <FieldGroup>
                <Field />
            </FieldGroup>
        </form>
    )
}
export default CreateAdminForm