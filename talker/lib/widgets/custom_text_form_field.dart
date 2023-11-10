import 'package:flutter/material.dart';
import 'package:talker/utils/helper.dart';

class CustomTextFormField extends StatefulWidget {
  final double width;
  bool? autofocus;
  final TextEditingController controller;
  final String labelText;
  final String hintText;
  final IconData prefixIcon;
  IconData? suffixIcon;
  final TextCapitalization textCapitalization;
  final double borderRadius;
  final TextInputType keyboardType;
  bool? isObscure;
  Function()? suffixIconOnPressed;
  final Function onChanged;
  String? Function(String?)? validator;

  CustomTextFormField({
    Key? key,
    required this.width,
    this.autofocus,
    required this.controller,
    required this.labelText,
    required this.hintText,
    required this.prefixIcon,
    this.suffixIcon,
    required this.textCapitalization,
    required this.borderRadius,
    required this.keyboardType,
    this.isObscure,
    this.suffixIconOnPressed,
    required this.onChanged,
    this.validator,
  }) : super(key: key);

  @override
  State<CustomTextFormField> createState() => _CustomTextFormFieldState();
}

class _CustomTextFormFieldState extends State<CustomTextFormField> {
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 5.0, vertical: 5.0),
      width: widget.width,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            widget.labelText,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: Helper().createMaterialColor(const Color(0xFFF2F3F5)),
            ),
          ),
          const SizedBox(height: 10),
          TextFormField(
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
            maxLines: widget.isObscure ?? false ? 1 : null,
            autofocus: widget.autofocus ?? false,
            textCapitalization: widget.textCapitalization,
            controller: widget.controller,
            decoration: InputDecoration(
              fillColor: Colors.white,
              hintText: widget.hintText,
              hintStyle: TextStyle(
                color: Helper().createMaterialColor(const Color(0xFFF2F3F5)),
                fontWeight: FontWeight.bold,
              ),
              suffixIcon: widget.suffixIcon != null
                  ? IconButton(
                      onPressed: () {
                        widget.suffixIconOnPressed!();
                      },
                      icon: Icon(widget.suffixIcon),
                    )
                  : const SizedBox.shrink(),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(widget.borderRadius),
                borderSide: const BorderSide(
                  color: Colors.black,
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(widget.borderRadius),
                borderSide: const BorderSide(
                  color: Colors.black,
                ),
              ),
            ),
            keyboardType: widget.keyboardType,
            obscureText: widget.isObscure ?? false,
            onChanged: (value) {
              widget.onChanged(value);
            },
            validator: widget.validator,
          ),
        ],
      ),
    );
  }
}
