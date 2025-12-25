import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FloatingInput } from '@/components/resume-builder/FloatingInput';

describe('FloatingInput', () => {
  describe('rendering', () => {
    it('renders with label when empty and not focused', () => {
      render(
        <FloatingInput label="Full Name" value="" onChange={() => {}} />
      );
      
      expect(screen.getByText('Full Name')).toBeInTheDocument();
    });

    it('renders input element', () => {
      render(
        <FloatingInput label="Full Name" value="" onChange={() => {}} />
      );
      
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders textarea when multiline is true', () => {
      render(
        <FloatingInput 
          label="Summary" 
          value="" 
          onChange={() => {}} 
          multiline 
        />
      );
      
      const textarea = screen.getByRole('textbox');
      expect(textarea.tagName.toLowerCase()).toBe('textarea');
    });

    it('displays value in input', () => {
      render(
        <FloatingInput label="Full Name" value="John Doe" onChange={() => {}} />
      );
      
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    });
  });

  describe('label behavior', () => {
    it('hides label when input has value', () => {
      render(
        <FloatingInput label="Full Name" value="John" onChange={() => {}} />
      );
      
      expect(screen.queryByText('Full Name')).not.toBeInTheDocument();
    });

    it('hides label when input is focused', async () => {
      const user = userEvent.setup();
      
      render(
        <FloatingInput label="Full Name" value="" onChange={() => {}} />
      );
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      
      expect(screen.queryByText('Full Name')).not.toBeInTheDocument();
    });

    it('shows label when input is blurred and empty', async () => {
      const user = userEvent.setup();
      
      render(
        <FloatingInput label="Full Name" value="" onChange={() => {}} />
      );
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.tab(); // blur
      
      expect(screen.getByText('Full Name')).toBeInTheDocument();
    });
  });

  describe('onChange callback', () => {
    it('calls onChange when typing', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      
      render(
        <FloatingInput label="Full Name" value="" onChange={handleChange} />
      );
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'a');
      
      expect(handleChange).toHaveBeenCalledWith('a');
    });

    it('calls onChange for each character typed', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      
      render(
        <FloatingInput label="Full Name" value="" onChange={handleChange} />
      );
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'abc');
      
      expect(handleChange).toHaveBeenCalledTimes(3);
    });
  });

  describe('focus and blur callbacks', () => {
    it('calls onFocus when input is focused', async () => {
      const user = userEvent.setup();
      const handleFocus = vi.fn();
      
      render(
        <FloatingInput 
          label="Full Name" 
          value="" 
          onChange={() => {}} 
          onFocus={handleFocus}
        />
      );
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur when input loses focus', async () => {
      const user = userEvent.setup();
      const handleBlur = vi.fn();
      
      render(
        <FloatingInput 
          label="Full Name" 
          value="" 
          onChange={() => {}} 
          onBlur={handleBlur}
        />
      );
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.tab();
      
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('works without onFocus/onBlur callbacks', async () => {
      const user = userEvent.setup();
      
      render(
        <FloatingInput label="Full Name" value="" onChange={() => {}} />
      );
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.tab();
      
      // Should not throw
      expect(input).toBeInTheDocument();
    });
  });

  describe('multiline mode', () => {
    it('renders multiple rows for textarea', () => {
      render(
        <FloatingInput 
          label="Summary" 
          value="" 
          onChange={() => {}} 
          multiline 
        />
      );
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('rows', '3');
    });

    it('handles multiline input changes', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      
      render(
        <FloatingInput 
          label="Summary" 
          value="" 
          onChange={handleChange} 
          multiline 
        />
      );
      
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Line 1');
      
      expect(handleChange).toHaveBeenCalled();
    });

    it('displays multiline value', () => {
      render(
        <FloatingInput 
          label="Summary" 
          value={'Line 1\nLine 2'} 
          onChange={() => {}} 
          multiline 
        />
      );
      
      const textarea = screen.getByRole('textbox');
      expect(textarea.textContent).toContain('Line 1');
    });
  });

  describe('className prop', () => {
    it('applies custom className to input', () => {
      render(
        <FloatingInput 
          label="Full Name" 
          value="" 
          onChange={() => {}} 
          className="custom-class"
        />
      );
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-class');
    });

    it('applies custom className to textarea', () => {
      render(
        <FloatingInput 
          label="Summary" 
          value="" 
          onChange={() => {}} 
          multiline
          className="custom-class"
        />
      );
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('custom-class');
    });
  });
});
