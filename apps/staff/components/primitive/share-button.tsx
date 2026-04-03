"use client";

import { useModal } from "@/providers/modal-provider";
import { Button } from "@workspace/ui/components/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Share } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
    url: string;
}

interface ShareButtonPropsExtended extends ShareButtonProps {
    asChild?: boolean;
    children?: React.ReactNode;
}

const ShareButton = ({ url, asChild, children }: ShareButtonPropsExtended) => {
    const [copy, setCopy] = useState(url);
    const { isOpen, setOpen } = useModal()

    const handleCopy = () => {
        navigator.clipboard.writeText(copy).then(() => {
            setCopy("Copied!");
            setTimeout(() => {
                setCopy(url);
            }, 2000);
        }).catch(() => {
            setCopy("Failed to copy!");
            setTimeout(() => {
                setCopy(url);
            }, 2000);
        });
    }
    
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children ? (
                    children
                ) : (
                    <Button variant={'ghost'}>
                        <Share />
                        <span className="font-semibold">Share</span>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Share this content</DialogTitle>
                <DialogDescription>
                    Anyone with this link can view this content
                </DialogDescription>
                </DialogHeader>
                <div>
                    <Input value={url} readOnly type="text" />
                    <Button onClick={handleCopy} className="mt-2">
                        Copy Link
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
export default ShareButton;