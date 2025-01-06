import { CustomFormField, CustomFormSelect } from '@/components';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useAppDispatch, useAppSelector } from '@/hooks/redux-toolkit';
import {
  JobType,
  JobStatus,
  Search,
  searchSchema,
  searchSchemaType,
} from '@/utils/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  All,
  clearFilters,
  FilterSortType,
  FiltersStateType,
  setFilters,
} from '@/features/allJobs/allJobsSlice';

const initialState: Search = {
  search: '',
  searchStatus: All.all,
  searchType: All.all,
  sort: FilterSortType.latest,
};

const SearchContainer = () => {
  const { isLoading, filters } = useAppSelector((store) => store.allJobs);
  const dispatch = useAppDispatch();

  const form = useForm<searchSchemaType>({
    resolver: zodResolver(searchSchema),
    defaultValues: initialState,
  });
  const handleSubmit = (values: searchSchemaType) => {
    values.search = values.search || '';
    if (
      filters.search !== values.search ||
      filters.searchStatus !== values.searchStatus ||
      filters.searchType !== values.searchType
    ) {
      // here we have to add the reset page to one for the setFilters call
      dispatch(setFilters({ ...(values as FiltersStateType), page: 1 }));
    } else {
      dispatch(setFilters(values as FiltersStateType));
    }
    //console.log('submitting search ..., values=', values);
  };
  const handleClear = () => {
    dispatch(clearFilters());
    form.reset(initialState);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='grid grid-cols-1 gap-y-4 bg-white p-4 rounded-md'
      >
        <h3 className='text-3xl font-semibold text-center capitalize bg-[0 0% 100%]'>
          search applications
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-baseline'>
          <CustomFormField
            name='search'
            type='text'
            control={form.control}
            className='bg-muted'
          />
          <CustomFormSelect
            name='searchStatus'
            control={form.control}
            labelText='job status'
            items={[All.all, ...Object.values(JobStatus)]} // All.all, ... so that the list starts with all - if you put it on the end, then it will also be rendered as last option
            className='form-control bg-muted'
          />
          <CustomFormSelect
            name='searchType'
            control={form.control}
            labelText='job type'
            items={[All.all, ...Object.values(JobType)]} // All.all, ... so that the list starts with all - if you put it on the end, then it will also be rendered as last option
            className='form-control bg-muted'
          />
          <CustomFormSelect
            name='sort'
            control={form.control}
            labelText='job type'
            items={Object.values(FilterSortType)}
            className='form-control bg-muted'
          />
          <div className='self-end flex justify-between'>
            <Button
              type='button'
              onClick={handleClear}
              className='px-8 bg-red-400 hover:bg-destructive'
            >
              Clear filters
            </Button>

            <Button
              type='submit'
              disabled={isLoading}
              className='px-8 bg-blue-400 hover:bg-blue-600 self-end'
            >
              {!isLoading ? 'Search' : 'Searching...'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
export default SearchContainer;
