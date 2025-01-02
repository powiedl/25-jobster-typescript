// import { Control } from 'react-hook-form';
// import { RegisterFormType } from '@/utils/types';
//import { FieldValues } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from './ui/input';

type CustomFormFieldProps = {
  name: string;
  label?: string;
  // I was not able to figure out what type to use for control
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  type: 'text' | 'email' | 'password';
  className?: string;
  onChangeCapture?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function CustomFormField({
  name,
  type = 'text',
  label,
  control,
  className = '',
  onChangeCapture,
}: CustomFormFieldProps) {
  const handleChangeCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeCapture?.(e);
  };
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className='capitalize'>{label || name}</FormLabel>
          <FormControl>
            {onChangeCapture ? (
              <Input
                {...field}
                type={type}
                className={className}
                onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChangeCapture(e)
                }
              />
            ) : (
              <Input {...field} type={type} className={className} />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

type CustomFormSelectProps = {
  name: string;
  // I was not able to figure out what type to use for control
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  items: string[];
  labelText?: string;
  className?: string;
};

export function CustomFormSelect({
  name,
  control,
  items,
  labelText,
  className = '',
}: CustomFormSelectProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className='capitalize'>{labelText || name}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent className={className}>
              {items.map((item) => {
                return (
                  <SelectItem key={item} value={item} className={className}>
                    {item}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
