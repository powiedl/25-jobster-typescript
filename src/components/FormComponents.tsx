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
import { ControllerRenderProps, FieldValues } from 'react-hook-form';

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

type HelperFormSelectProps = {
  items: string[];
  className?: string;
};

type CustomFormSelectProps = HelperFormSelectProps & {
  name: string;
  // I was not able to figure out what type to use for control
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  //  items: string[];
  labelText?: string;
  //  className?: string;
  onValueChange?: (name: string, value: string) => void;
};

export function CustomFormSelect({
  name,
  control,
  items,
  labelText,
  className = '',
  onValueChange,
}: CustomFormSelectProps) {
  const handleChange = (
    f: ControllerRenderProps<FieldValues, string>,
    e: string,
    onValueChange?: (name: string, value: string) => void
  ) => {
    //console.log('---------------------------------');
    onValueChange?.(f.name, e);
    //console.log('handleChange event', e);
    f.onChange(e);
  };
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className='capitalize'>{labelText || name}</FormLabel>
          <Select
            onValueChange={(e) => handleChange(field, e, onValueChange)}
            defaultValue={field.value}
          >
            <HelperFormSelect items={items} className={className} />
          </Select>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

const HelperFormSelect = ({ items, className = '' }: HelperFormSelectProps) => {
  return (
    <>
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
    </>
  );
};
