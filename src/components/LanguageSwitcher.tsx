import { useTranslation } from 'react-i18next';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
    const { i18n, t } = useTranslation();

    const handleLanguageChange = (value: string) => {
        i18n.changeLanguage(value);
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <div>
                    <p className="font-medium text-foreground">{t('profile.language')}</p>
                    <p className="text-sm text-muted-foreground">{t('profile.language_desc')}</p>
                </div>
            </div>
            <Select value={i18n.language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="en">English (EN)</SelectItem>
                    <SelectItem value="ur">اردو (UR)</SelectItem>
                    <SelectItem value="hi">हिंदी (HI)</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
